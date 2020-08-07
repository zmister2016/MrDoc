//修改用户密码
changePwd = function(uid,username){
    layer.open({
        type:1,
        title:'修改密码',
        area:'300px;',
        id:'changePwd',
        content:'<div style="padding:10px 0 0 20px;">修改用户[' + username + ']的密码：</div><div style="padding: 20px;"><input class="layui-input" type="password" id="newPwd1" style="margin-bottom:10px;" placeholder="输入新密码" required  lay-verify="required"><input class="layui-input" type="password" id="newPwd2" placeholder="再次确认新密码" required  lay-verify="required"></div>',
        btn:['确认修改','取消'],
        yes:function (index,layero) {
            data = {
                'password':$("#newPwd1").val(),
                'password2':$("#newPwd2").val(),
            }
            $.post("{% url 'modify_pwd' %}",data,function(r){
                if(r.status){
                    //修改成功
                    window.location.reload();
                    //layer.close(index)
                }else{
                    //修改失败，提示
                    //console.log(r)
                    layer.msg(r.data)
                }
            })
        },
    })
};
