/**  by zhangruidong   **/

var handle = {
    state:{
        "size":true, //默认为大图标，就是true的状态
        "sort":false, //默认状态不进行时间的排序
        "nowPid":1, // 当前文件展示的父级id
        "maxId":data.length  // 当前最大的id
    },
    getByPid: function(pid){ // 通过 pid 获取元素的集合
        return data.filter( function(item){
            return item.pid === pid;
        } )
    },
    getById: function(id){ // 通过 id 获取元素
        return data.filter( function(item){
            return item.id === id;
        } )[0]
    },
    getTime:function (t) {//通过时间戳返回一个格式化后的时间
        var nowDate=new Date(t);
        var year=nowDate.getFullYear()
        var month=this.add0(nowDate.getMonth()+1)
        var date=this.add0(nowDate.getDate())
        var h=this.add0(nowDate.getHours())
        var min=this.add0(nowDate.getMinutes())
        return year+"-"+month+"-"+date+"  "+h+":"+min
    },
    add0:function (num) { //给数值小于10的数字在前面补零
        num=num<10?"0"+num:num
      return   num;
    },
    /**
     *通过pid生成HTML(ul下的li)
     * @param pid
     * @param plNum  递归增加的h3的padding
     * @returns {string}  需要生成的 HTML
     */
    formHtmlByPid:function(pid,plNum){
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
                            <small data-id="${d[i].id}">
                                <span class="fileIcon" style="left:${paddingLeft-22}px"></span>
                                ${d[i].name }
                            </small>
                        </h2>
                    </li>
                `
            }else{//有子级
                var a = paddingLeft + 28;
                str+=`
                    <li>
                        <h2 style='padding-left:${paddingLeft}px'>
                            <span class="triangleR" style="left:${paddingLeft-52}px"></span>
                            <small data-id="${d[i].id}">
                                <span class="fileIcon" style="left:${paddingLeft-22}px"></span>
                                ${d[i].name }
                            </small>
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
    treeAddEvent:function () { //给文件树下的元素 添加事件
        var tree=document.getElementById("tree");
        var h2s=tree.querySelectorAll("h2");
        var smalls=tree.querySelectorAll("small");
        for(var i=0;i<smalls.length;i++){
            smalls[i].addEventListener("click",function () {
                this.id=this.getAttribute("data-id");
                var d=handle.getByPid(Number(this.id))
                handle.showFile(d);
                var breadData=handle.getBreadArr(this.id);
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
                var fileIcon=this.parentNode.querySelector(".fileIcon");
                if(ul){
                    if(this.classList.contains("triangleR")){
                        ul.style.display="block";
                        fileIcon.classList.add("open");
                        this.classList.remove("triangleR");
                        this.classList.add("triangleD");
                    }else if(this.classList.contains("triangleD")){
                        ul.style.display="none";
                        fileIcon.classList.remove("open");
                        var uls=ul.querySelectorAll("ul");
                        var h2s=ul.querySelectorAll("h2");
                        for (var i = 0; i < uls.length; i++) {
                            uls[i].style.display="none";
                        }
                        for (var i = 0; i < h2s.length; i++) {
                            var span=h2s[i].querySelector("span");
                            var fileIcon=h2s[i].querySelector(".fileIcon");
                            fileIcon.classList.remove("open")
                            if(span.classList.contains("triangleD")){
                                span.classList.remove("triangleD");
                                span.classList.add("triangleR");
                            }
                        }
                        this.classList.remove("triangleD");
                        this.classList.add("triangleR");
                        //todo open
                    }
                }
            })
        }
    },
    creatTree:function(){//创建左侧树型菜单
        var d = handle.getByPid(0);//获取pid为0的数据
        if(d.length == 0){//代表没有获取到
            return
        }
        document.querySelector("#tree").innerHTML = handle.formHtmlByPid(0,62);
        handle.treeAddEvent();
    },
    showFile:function (arr) { // 展示文件夹的内容    arr为需要展示文件的数组
        var file=document.getElementById("file");
        var files=file.querySelector(".files");
        var minFiles=file.querySelector(".min-files");
        var noFile=file.querySelector(".no-content");
        files.addEventListener("click",function () {
            var lis=files.querySelectorAll("li");
            for (var i = 0; i < lis.length; i++) {
                lis[i].classList.remove("active");
            }
        })
        if(arr.length==0){
            noFile.style.display="block";
            files.style.display="none";
            minFiles.style.display="none";
        }else{
            if(handle.state.size){
                //todo 通过开关显示不同的文件类型
                noFile.style.display="none";
                files.style.display="block";
                minFiles.style.display="none";
                file.dataId=arr[0].pid;
                var str="";
                for(var i=0;i<arr.length;i++){
                    str+=`
                        <li data-id="${arr[i].id}" class="file">
                            <p>${arr[i].name}</p>
                            <input type="text" value=${arr[i].name}>
                        </li>
                `
                }
                files.innerHTML=str;
                var lis=file.getElementsByTagName("li");
                handle.filesAddEvent(lis);
            }else{
                noFile.style.display="none";
                files.style.display="none";
                minFiles.style.display="block";
                var str="";
                for(var i=0;i<arr.length;i++){
                    str+=`
                        <li data-id="${arr[i].id}" class="file">
                            <p>${arr[i].name}</p>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <time>${handle.getTime(arr[i].time)}</time>
                        </li>
                `
                }
                minFiles.innerHTML=str;
                var lis=file.getElementsByTagName("li");
                handle.filesAddEvent(lis);
            }
        }
    },
    filesAddEvent:function (lis) { //添加事件  lis需要添加事件的元素的集合
        for (var i = 0; i < lis.length; i++) {
            lis[i].addEventListener("click",function (e) {
                handle.fnClick.call(this,e,lis)
            });
            lis[i].addEventListener("dblclick",handle.fnDblclick)
        }
    },
    fnClick:function (e,lis) {
        e.stopPropagation();
        var inp=this.querySelector("input");
        if(this.classList.contains("active") && getComputedStyle(inp)["display"]=="none"){
            inp.style.display="block"
            inp.select()
            inp.onclick=function (e) {
                e.cancelBubble=true;
            }
            inp.onblur=function () {
                var id=Number(this.parentNode.getAttribute("data-id"));
                var item=handle.getById(id);
                //todo  click事件需要优化处理
                for (var i = 0; i < data.length; i++) {
                    if(data[i].name==item.name){
                        data[i].name=this.value;
                    }
                };
                handle.creatTree();
                // item.name=this.vlaue;
                this.previousElementSibling.innerHTML=this.value;
                setTimeout(function () {
                    this.style.display="none";
                }.bind(this),120)
            }
            for (var i = 0; i < lis.length; i++) {
                lis[i].classList.remove("active");
            }
            this.classList.add("active")
            return
        }else if(this.classList.contains("active") && getComputedStyle(inp)["display"]=="block"){
            for (var i = 0; i < lis.length; i++) {
                lis[i].classList.remove("active");
            }
            this.classList.add("active")
            return
        }
        for (var i = 0; i < lis.length; i++) {
            lis[i].classList.remove("active");
        }
        this.classList.toggle("active")
    },
    fnDblclick:function () {
        var d=handle.getByPid(Number(this.getAttribute("data-id")));
        handle.showFile(d);
        var id=this.getAttribute("data-id");
        var breadData=handle.getBreadArr(id);
        handle.breadcrumb(breadData);
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
                var id=this.getAttribute("data-id")
                var d=handle.getByPid(Number(id))
                handle.showFile(d);
                var breadData=handle.getBreadArr(id);
                handle.breadcrumb(breadData);
                handle.creatTree();
                handle.openTree(id);
            })
        }
    },
    openTree:function (id) {
        // todo 文件树同步打开
        var tree=document.getElementById("tree");
        var small=tree.querySelector("small[data-id='"+id+"']")
        /*ul.style.display="block";
        fileIcon.classList.add("open");
        this.classList.remove("triangleR");
        this.classList.add("triangleD");*/
        var h2=small.parentNode;
        var ul=h2.nextElementSibling;
        small.querySelector(".fileIcon").classList.add("open");
        console.log(ul)
    },
    newFile:function () {
        var file=document.querySelector("#file");
        var pid=file.dataId;
        if(handle.state.size){ //大图标
            var files=file.querySelector(".files");
            var id=data[data.length-1].id+1;
            var name="新建文件夹";
            // todo end
            var li=document.createElement("li");
            li.setAttribute("data-id",id);
            li.className="file active";
            li.innerHTML=`
                            <p>${name}</p>
                            <input type="text" value=${name}>
                `;
            files.appendChild(li);
            var lis=files.querySelectorAll("li");
            data.push({
                "id":id,
                "name":name,
                "pid":pid,
                "time":Date.now()
            })
            console.log(lis)
            /*var inp=li.querySelector("input");
            inp.style.display="block";
            inp.select();*/
            li.addEventListener("click",function (e) {
                handle.fnClick.call(this,e,lis)
            });
            li.addEventListener("dblclick",handle.fnDblclick)

        }else {
            var minFiles=file.querySelector(".min-files");
            console.log(minFiles)
        }
    }
}
