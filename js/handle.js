/**  by zhangruidong   **/

var handle = {
    getByPid: function(pid){ // 通过 pid 获取元素
        return data.filter( function(item){
            return item.pid === pid;
        } )
    },
    getById: function(id){ // 通过 id 获取元素
        return data.filter( function(item){
            return item.id === id;
        } )[0]
    },
    /**
     *
     * @param pid
     * @param plNum  递归增加的h3的padding
     * @returns {string}  需要生成的 HTML
     */
    formHtmlByPid:function(pid,plNum){ // 通过pid生成HTML(ul下的li)
        var str = "";
        var paddingLeft = plNum;
        var d = this.getByPid( pid );//获取数据
        for (var i = 0; i < d.length; i++) {
            var temp = this.getByPid( d[i].id );//查找以d[i].id为pid的数据,比如查找 pid 为1的所有数据
            if( temp.length === 0 ){//没有 "子级"
                str+=`
                    <li>
                        <h2 style='padding-left: ${paddingLeft}px'>
                            <span class="triangleR" style="left:${paddingLeft-52}px"></span>
                            <span class="fileIcon" style="left:${paddingLeft-22}px"></span>
                            <small data-id="${d[i].id}">${d[i].name }</small>
                        </h2>
                    </li>
                `
            }else{//有子级
                var a = paddingLeft + 28;
                str+=`
                    <li>
                        <h2 style='padding-left:${paddingLeft}px'>
                            <span class="triangleR" style="left:${paddingLeft-52}px"></span>
                            <span class="fileIcon" style="left:${paddingLeft-22}px"></span>
                            <small data-id="${d[i].id}">${d[i].name }</small>
                        </h2>
                        <ul>
                            ${this.formHtmlByPid( d[i].id, a)}
                        </ul>
                    </li>
                `
            }
        }
        return str;
    },
    treeAddEvent:function () {
        var tree=document.getElementById("tree");
        var h2s=tree.querySelectorAll("h2");
        var smalls=tree.querySelectorAll("small");
        for(var i=0;i<smalls.length;i++){
            smalls[i].addEventListener("click",function () {
                this.id=this.getAttribute("data-id");
                var d=handle.getByPid(Number(this.id))
                handle.showFile(d);
                var breadData=handle.getBreadArr(this.id);
                // todo ??
                handle.breadcrumb(breadData);
            })
        }

        for(var i=0;i<h2s.length;i++){
            var triangle=h2s[i].querySelector("span");
            var ul=h2s[i].nextElementSibling;
            if(!ul){
                triangle.classList.remove("triangleR")
                continue
            }
            ul.style.display="none";
            triangle.addEventListener("click",function () {
                var ul=this.parentNode.nextElementSibling;
                if(ul){
                    if(this.classList.contains("triangleR")){
                        ul.style.display="block";
                        this.classList.remove("triangleR");
                        this.classList.add("triangleD");
                    }else if(this.classList.contains("triangleD")){
                        ul.style.display="none";
                        var uls=ul.querySelectorAll("ul");
                        var h2s=ul.querySelectorAll("h2");
                        for (var i = 0; i < uls.length; i++) {
                            uls[i].style.display="none";
                        }
                        for (var i = 0; i < h2s.length; i++) {
                            var span=h2s[i].querySelector("span");
                            if(span.classList.contains("triangleD")){
                                span.classList.remove("triangleD");
                                span.classList.add("triangleR");
                            }
                        }
                        this.classList.remove("triangleD");
                        this.classList.add("triangleR");
                    }
                }
            })
        }

    },
    creatTree:function(){//创建左侧树型菜单

        var d = this.getByPid(0);//获取pid为0的数据
        if(d.length == 0){//代表没有获取到
            return
        }
        document.querySelector("#tree").innerHTML = this.formHtmlByPid(0,62);
        this.treeAddEvent();
    },
    showFile:function (arr) {
        var file=document.getElementById("file");
        var files=file.querySelector(".files");
        var minFiles=file.querySelector(".min-files")
        var noFile=file.querySelector(".no-content")
        if(arr.length==0){
            noFile.style.display="block";
            files.style.display="none";
            minFiles.style.display="none";
        }else{
            noFile.style.display="none";
            files.style.display="block";
            minFiles.style.display="none";
            var str="";
            for(var i=0;i<arr.length;i++){
                str+=`
                        <li data-id="${arr[i].id}" class="file">
                            <p>${arr[i].name}</p>
                            <input type="text" value="js">
                        </li>
                `
            }
            files.innerHTML=str;
            var lis=files.querySelectorAll("li");
            handle.filesAddEvent(lis);
        }
    },
    filesAddEvent:function (lis) {
        for (var i = 0; i < lis.length; i++) {
            lis[i].addEventListener("dblclick",function () {
                var d=handle.getByPid(Number(this.getAttribute("data-id")));
                handle.showFile(d);
            })
        }
    },
    getParent:function (arr) {
        var item=arr[0];
        if(item.pid==0){
            return
        }else{
            var p=handle.getById(item.pid);
            arr.unshift(p);
        }
        handle.getParent(arr);
    },
    getBreadArr:function (id) {
        var arr=[];
        var item=handle.getById(Number(id));
        arr.push(item);
        handle.getParent(arr);
        return arr;
    },
    breadcrumb:function (arr) {
        // todo breadcrumb
        var nav=document.getElementById("nav");
        var str=`
            <input type="checkbox">
        `;
        for (var i = 0; i < arr.length; i++) {
            str+=`
                <div data-id=${arr[i].id} class="directory">${arr[i].name}</div>
            `;
        }
        nav.innerHTML=str;
        var divs=nav.querySelectorAll("div");
        for(var i=0;i<divs.length;i++){
            divs[i].addEventListener("click",function () {
                //todo nav click
                var id=this.getAttribute("data-id")
                var d=handle.getByPid(Number(id))
                handle.showFile(d);
                var breadData=handle.getBreadArr(id);
                handle.breadcrumb(breadData);
            })
        }

    }
}
