from django.contrib.auth.models import AnonymousUser, User
from django.test import TestCase
from django.test.client import RequestFactory

from app_doc.models import Doc, Project
from app_doc.views import check_viewcode, get_pro_doc, get_pro_doc_tree


class ProjectAnonymousPermissionTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.owner = User.objects.create_user(username='owner', password='password')
        self.private_project = Project.objects.create(
            name='private project',
            intro='private project',
            role=1,
            create_user=self.owner,
        )
        self.private_doc = Doc.objects.create(
            name='secret doc',
            pre_content='secret',
            content='secret content',
            top_doc=self.private_project.id,
            create_user=self.owner,
        )

    def test_get_pro_doc_rejects_anonymous_private_project(self):
        request = self.factory.post('/get_pro_doc/', {'pro_id': self.private_project.id})
        request.user = AnonymousUser()

        response = get_pro_doc(request)

        self.assertJSONEqual(
            response.content,
            {'status': False, 'data': '无权访问'},
        )

    def test_get_pro_doc_tree_rejects_anonymous_private_project(self):
        request = self.factory.post('/get_pro_doc_tree/', {'pro_id': self.private_project.id})
        request.user = AnonymousUser()

        response = get_pro_doc_tree(request)

        self.assertJSONEqual(
            response.content,
            {'status': False, 'data': '无权访问'},
        )

    def test_check_viewcode_does_not_render_private_project_name(self):
        request = self.factory.get(
            '/check_viewcode/',
            {'to': '/project/{}/'.format(self.private_project.id)},
        )
        request.user = AnonymousUser()

        response = check_viewcode(request)

        self.assertEqual(response.status_code, 200)
        self.assertNotContains(response, self.private_project.name)
