import json

from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.test import APIClient

from app_doc.models import Project, Doc, ProjectCollaborator
from app_doc.utils import normalize_allowed_usernames, get_project_allowed_usernames, check_user_project_view_role


class DocSortAuthTest(TestCase):
    """文档排序/发布接口的越权防护回归测试"""

    def setUp(self):
        self.api_client = APIClient()  # 用于 DRF 接口，force_authenticate 可绕过 CSRF 强校验
        self.attacker = User.objects.create_user('attacker', password='pwd')
        self.victim = User.objects.create_user('victim', password='pwd')
        self.colla = User.objects.create_user('colla', password='pwd')

        self.pro_victim = Project.objects.create(name='victim-pro', intro='', create_user=self.victim)
        self.pro_attacker = Project.objects.create(name='attacker-pro', intro='', create_user=self.attacker)

        self.victim_draft = Doc.objects.create(
            name='victim-draft', top_doc=self.pro_victim.id,
            create_user=self.victim, status=0,
        )
        self.my_doc = Doc.objects.create(
            name='my-doc', top_doc=self.pro_attacker.id,
            create_user=self.attacker, status=0,
        )
        ProjectCollaborator.objects.create(project=self.pro_attacker, user=self.colla, role=0)

    def test_put_rejects_foreign_doc(self):
        """越权发布他人草稿必须被拒绝，且文档数据保持不变"""
        self.api_client.force_authenticate(self.attacker)
        resp = self.api_client.put(
            '/api/import_local_doc/',
            data={'sort_data': json.dumps([{'id': self.victim_draft.id}])},
        )
        self.assertEqual(resp.json().get('code'), 5)
        self.victim_draft.refresh_from_db()
        self.assertEqual(self.victim_draft.status, 0)
        self.assertEqual(self.victim_draft.parent_doc, 0)

    def test_put_allows_own_imported_docs(self):
        """正常导入发布流程不受影响"""
        self.api_client.force_authenticate(self.attacker)
        resp = self.api_client.put(
            '/api/import_local_doc/',
            data={'sort_data': json.dumps([{'id': self.my_doc.id}])},
        )
        self.assertEqual(resp.json().get('code'), 0)
        self.my_doc.refresh_from_db()
        self.assertEqual(self.my_doc.status, 1)

    def test_put_rejects_mixed_project_docs(self):
        """同一请求里混入其它文集的文档必须整单拒绝"""
        self.api_client.force_authenticate(self.attacker)
        resp = self.api_client.put(
            '/api/import_local_doc/',
            data={'sort_data': json.dumps(
                [{'id': self.my_doc.id, 'children': [{'id': self.victim_draft.id}]}]
            )},
        )
        self.assertEqual(resp.json().get('code'), 5)
        self.my_doc.refresh_from_db()
        self.victim_draft.refresh_from_db()
        self.assertEqual(self.my_doc.status, 0)
        self.assertEqual(self.victim_draft.status, 0)

    def test_put_rejects_cycle_and_duplicate(self):
        """自引用/重复 ID 按参数错误处理，不写入脏数据"""
        self.api_client.force_authenticate(self.attacker)
        bad = json.dumps([{'id': self.my_doc.id, 'children': [{'id': self.my_doc.id}]}])
        resp = self.api_client.put('/api/import_local_doc/', data={'sort_data': bad})
        self.assertEqual(resp.json().get('code'), 5)
        self.my_doc.refresh_from_db()
        self.assertEqual(self.my_doc.parent_doc, 0)

    def test_manage_sort_rejects_foreign_doc(self):
        """用自己的文集 ID 夹带他人文档必须被拒绝"""
        self.client.force_login(self.attacker)
        resp = self.client.post(
            f'/manage_pro_doc_sort/{self.pro_attacker.id}/',
            data={'pid': self.pro_attacker.id, 'sort_data': json.dumps([{'id': self.victim_draft.id}])},
        )
        self.assertFalse(resp.json().get('status'))
        self.victim_draft.refresh_from_db()
        self.assertEqual(self.victim_draft.status, 0)
        self.assertEqual(self.victim_draft.parent_doc, 0)

    def test_manage_sort_allows_project_owner(self):
        """文集创建者整理自己的文档树仍然可用"""
        self.client.force_login(self.attacker)
        resp = self.client.post(
            f'/manage_pro_doc_sort/{self.pro_attacker.id}/',
            data={'pid': self.pro_attacker.id, 'sort_data': json.dumps([{'id': self.my_doc.id}])},
        )
        self.assertTrue(resp.json().get('status'))
        self.my_doc.refresh_from_db()
        self.assertEqual(self.my_doc.sort, 10)


class ProjectSpecifiedUsernameAuthTest(TestCase):
    """指定用户可见文集的用户名精确匹配回归测试"""

    def setUp(self):
        self.owner = User.objects.create_user('owner', password='pwd')
        self.allowed = User.objects.create_user('joann', password='pwd')
        self.attacker = User.objects.create_user('ann', password='pwd')
        self.unrelated = User.objects.create_user('mallory', password='pwd')
        self.project = Project.objects.create(
            name='specified-pro', intro='', create_user=self.owner,
            role=2, role_value='joann',
        )
        self.doc = Doc.objects.create(
            name='secret-doc', top_doc=self.project.id, create_user=self.owner,
            status=1, content='confidential-body', pre_content='confidential-body',
        )

    def test_normalize_allowed_usernames(self):
        """写入口归一化：去空格、去空项、去重"""
        self.assertEqual(normalize_allowed_usernames(' joann ,, joann, ann '), ['joann', 'ann'])
        self.assertEqual(get_project_allowed_usernames(self.project), {'joann'})

    def test_view_role_helper_uses_exact_username(self):
        """权限 helper 只认可完整用户名，不做子串匹配"""
        self.assertTrue(check_user_project_view_role(self.allowed.id, self.project.id))
        self.assertTrue(check_user_project_view_role(self.owner.id, self.project.id))
        self.assertFalse(check_user_project_view_role(self.attacker.id, self.project.id))
        self.assertFalse(check_user_project_view_role(self.unrelated.id, self.project.id))

    def test_doc_view_denies_substring_username(self):
        """ann 不能读取仅授权 joann 的文档"""
        self.client.force_login(self.attacker)
        resp = self.client.get(f'/doc/{self.doc.id}/')
        self.assertTemplateUsed(resp, '404.html')

    def test_doc_view_allows_listed_username(self):
        """被授权用户 joann 可以正常阅读文档"""
        self.client.force_login(self.allowed)
        resp = self.client.get(f'/doc/{self.doc.id}/')
        self.assertEqual(resp.status_code, 200)
        self.assertContains(resp, 'confidential-body')

    def test_doc_view_denies_unrelated_and_anonymous(self):
        """无关用户和匿名访客均被拒绝"""
        self.client.force_login(self.unrelated)
        self.assertTemplateUsed(self.client.get(f'/doc/{self.doc.id}/'), '404.html')
        self.client.logout()
        self.assertTemplateUsed(self.client.get(f'/doc/{self.doc.id}/'), '404.html')

    def test_project_view_denies_substring_username(self):
        """ann 不能访问仅授权 joann 的文集页"""
        self.client.force_login(self.attacker)
        resp = self.client.get(f'/project/{self.project.id}/', HTTP_USER_AGENT='test')
        self.assertTemplateUsed(resp, '404.html')

    def test_project_list_hides_specified_project(self):
        """文集列表不会把受限文集展示给子串用户名用户"""
        self.client.force_login(self.attacker)
        resp = self.client.get('/', HTTP_USER_AGENT='test')
        self.assertNotContains(resp, 'specified-pro')

        self.client.force_login(self.allowed)
        resp = self.client.get('/', HTTP_USER_AGENT='test')
        self.assertContains(resp, 'specified-pro')
