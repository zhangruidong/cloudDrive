/**  by zhangruidong   **/

handle.creatTree();

(function () {
    var resize=document.querySelector("#tool .rightIcon");
    resize.onclick=function () {
        this.classList.toggle("active");
        if(this.classList.contains("active")){
            handle.state.size=false;
        }else {
            handle.state.size=true;
        }
    }
})();
(function () {
    var newBtn=document.querySelector("#tool div:nth-of-type(6)");
    newBtn.onclick=handle.newFile;

    console.log(handle.state.maxId)
})();
/*
* creatTree
*openTree
* breadcrumb
* showFile
* */