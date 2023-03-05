from app_doc.models import Project,ProjectCollaborator

# 用户有浏览和、新增权限的文集列表
def read_add_projects(user):
    # 用户的协作文集ID列表
    colla_list = [i.project.id for i in ProjectCollaborator.objects.filter(user=user)]

    # 用户自己的文集ID列表
    self_list = [i.id for i in Project.objects.filter(create_user=user)]

    # 合并上述文集ID列表
    view_list = list(
        set(self_list)
            .union(set(colla_list))
    )
    return view_list


# 用户有浏览、新增、和修改所有文档权限的文集列表
def read_add_edit_projects(user):
    # 用户的协作文集ID列表
    colla_list = [i.project.id for i in ProjectCollaborator.objects.filter(user=user,role=1)]

    # 用户自己的文集ID列表
    self_list = [i.id for i in Project.objects.filter(create_user=user)]

    # 合并上述文集ID列表
    view_list = list(
        set(self_list)
            .union(set(colla_list))
    )
    return view_list