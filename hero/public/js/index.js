
$(function(){
    //  查询英雄
    getHeroList()

    // 添加英雄
    $("#add").on("click" ,() => {
        $('.ui.modal').modal('show')
        $("#btnAdd").css('display','')
        $('#btn').css('display','none');
        
    })

    // 初始化下拉框的样式
    $('.ui.dropdown').dropdown();

    $("#btnAdd").on("click",() => {
        $.ajax({
            type:'post',
            url: "http://127.0.0.1:5001/addhero",
            data: $("form").serialize(),
            dataType: 'json',
            success:function(res){
                if(res.status == 200) {
                    getHeroList();
                }
            }
        })
    })

    // 实现删除功能
    $("#tbd").on('click','#del',function (){
        var id = $(this).data('id');
        $.ajax({
            url:'http://127.0.0.1:5001/deletehero/' + id,
            type:'get',
            success:function(res){
                if(res.status == 200){
                    getHeroList();
                }
            }
        })
    
    })
    
    // 实现编辑功能
    let editId = null;
    $("#tbd").on("click","#edit",function (){
        $('.ui.modal').modal('show');
        editId = $(this).data('id');
        var name = $(this).data('name');
        var gender = $(this).data('gender');
        $("[type='text']").val(name);
        $('.selection > .text').html(gender);
        $("#btnAdd").css('display','none')
        $('#btn').css('display','');
    })
    $('#btn').on('click',function(){
        $.ajax({
            url:'http://127.0.0.1:5001/updatehero/'+ editId,
            type:'post',
            data: $('form').serialize(),
            dataType: 'json',
            success:function(res){
                if(res.status == 200){
                    getHeroList()
                }
            }
        })
    })
})


function getHeroList(){
    $.ajax({
        url:'http://127.0.0.1:5001/getallhero',
        type:'get',
        success:function(res){
            var html = template('getAllHero',res);
            $("#tbd").html(html);
        }
    })
}