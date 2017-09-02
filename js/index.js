/**  by zhangruidong   **/

handle.state.nowPid=1;
handle.creatTree();
handle.openTree();
handle.showFile();
handle.breadcrumb();

(function () {  // 文件 大小 图标显示
    var resize=document.querySelector("#tool .rightIcon");
    resize.onclick=function () {
        this.classList.toggle("active");
        if(this.classList.contains("active")){
            handle.state.size=false;  //小图标
        }else {
            handle.state.size=true;  //大图标
        }
        handle.creatTree();
        handle.openTree();
        handle.showFile();
        handle.breadcrumb();
    }
})();
(function () {
    var renameBtn=document.querySelector("#tool div:nth-of-type(4)");
    renameBtn.onclick=function () {
        var lis=document.querySelectorAll("#file .files li.active");
        var mask=document.querySelector(".mask");
        var alert=mask.querySelector(".alert");
        var h2=alert.querySelector("h2");
        var alert=mask.querySelector(".alert");
        if(lis.length==0 || lis.length>1){
            h2.innerHTML="请选择一个文件！";
            mask.style.display="block";
            alert.style.display="block";
            var btnR=alert.querySelector("input");
            var close=alert.querySelector(".close");
            btnR.onclick=fnClose;
            close.onclick=fnClose;
            function fnClose() {
                mask.style.display="none";
                alert.style.display="none";
            }
        }else{
            var inp=lis[0].querySelector("input");
            inp.style.display="block";
            inp.select();
        }
    }
})();
(function () { // 新建文件
    var newBtn=document.querySelector("#tool div:nth-of-type(6)");
    newBtn.onclick=handle.newFile;

})();

(function () { // 删除文件
    var removeBtn=document.querySelector("#tool div:nth-of-type(5)");
    removeBtn.onclick=handle.removeFile;

})();
/*
* creatTree
*openTree(handle.state.nowPid)
* breadcrumb(handle.state.nowPid)
* showFile(handle.state.nowPid)
*
* 重命名  如果重名，获得焦点还是使用旧的名字     双击input 将没有效果
* 新建
* 删除
* */

(function () {
    /*var mask=document.querySelector(".mask");
    var loading=mask.querySelector(".loading");
    mask.style.display="block";
    loading.style.display="block";*/
})();