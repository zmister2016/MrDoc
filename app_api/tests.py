from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.test import APIRequestFactory

from app_api.views_app import DocView
from app_doc.models import Doc, Project


class DocViewPermissionTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.owner = User.objects.create_user(username='owner', password='password')
        self.public_project = Project.objects.create(
            name='public',
            intro='public project',
            role=0,
            create_user=self.owner,
        )
        self.private_project = Project.objects.create(
            name='private',
            intro='private project',
            role=1,
            create_user=self.owner,
        )
        self.private_doc = Doc.objects.create(
            name='secret',
            pre_content='secret',
            content='secret content',
            top_doc=self.private_project.id,
            create_user=self.owner,
        )

    def test_doc_detail_requires_doc_to_belong_to_requested_project(self):
        request = self.factory.get(
            '/api_app/docs/',
            {
                'pid': self.public_project.id,
                'did': self.private_doc.id,
            },
        )

        response = DocView.as_view()(request)

        self.assertEqual(response.data['code'], 4)
