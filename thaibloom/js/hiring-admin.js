function Page(type,meta,menu){this.type = type;this.meta = meta;this.menu = menu;this.activeClass="";}
Page.prototype.hide = function(){
    document.getElementsByClassName(this.type)[0].classList.remove("active");
    document.getElementsByClassName(this.type+"-table")[0].classList.remove("show");
    document.getElementsByClassName(this.type+"-table")[0].classList.add("hide");
    // TODO: remove all active classes
}
Page.prototype.show = function(){
    document.getElementsByClassName(this.type)[0].classList.add("active");
    document.getElementsByClassName(this.type+"-table")[0].classList.remove("hide");
    document.getElementsByClassName(this.type+"-table")[0].classList.add("show");
}
Page.prototype.nav = function(className){
    this.show();
    this.meta.forEach((m)=>{
	var c = this.type+'.'+m;
	document.getElementsByClassName(c)[0].classList.remove("active");
    });
    var c = this.type+'.'+className;
    this.activeClass = className;
    document.getElementsByClassName(c)[0].classList.add("active");
}
Page.prototype.getPipeline = function(){
    return '<div class="tabbable">'
    + '<ul class="nav nav-tabs wizard">'
	+ this.meta.map((k)=>{
	    var c = this.type + '.' + k;
	    return '<li class="'+c+'"><a onclick="navigate(\''+c+'\')" data-toggle="tab" aria-expanded="false"><span class="nmbr '+k+'count"></span>'+k+'</a></li>'
	}).join("")
	+ "</ul>"
    + '</div>'
}

Page.prototype.getHeaderRow=function(keys){
    return "<tr>"
	+keys.map((key)=>{
	    return "<th scope='col'>"+key+"</th>";
	}).join("")
	+"</tr>";
}
Page.prototype.getTable = function(){
    return '<div class="container-fluid">'
	+'<table class="table">'
	+'<thead class="'
	+ this.type
	+'-table-head">'
	+ '</thead>'
	+'<tbody class="'
	+ this.type
	+ '-table-list"></tbody>'
	+'</table></div>';
}
Page.prototype.getWidget =function(){
    return "<div class='container-fluid'>"
        +"<a href='' class='btn btn-default btn-rounded mb-4' data-toggle='modal' data-target='#modal"
    +this.type
    + "Form'>Add</a></th></tr>"
    +"</div>";
}
Page.prototype.updateStats = function(stats){
    this.meta.map((a)=>{
	var d = stats.filter((s)=>{
	    return s.tags.indexOf(a)>=0
	}).length;
	return {
	    "key": a+"count",
	    "value": d
	};
    }).map((a)=>{
	return {
	    "key": a.key,
	    "doc": document.getElementsByClassName(a.key),
	    "value": a.value
	};
    }).filter((a)=>{
	return a.doc.length>0;
    }).forEach((a,index)=>{
	a.doc[0].innerText = a["value"];
    });
}

Page.prototype.getRow = function(row,data){
   var keys = Object.keys(data);
    return "<tr>"
    + keys.map((key)=>{
	return "<td>"+data[key]+"</td>";
    }).join("")
	+ this.menu.map((mitem)=>{
		return "<td><button onclick='raise(\""+mitem+"\",\""+row+"\")'>"+mitem+"</button></td>"
	}).join("")
    + "</tr>";
}
Page.prototype.updateTable = function(data){
    var tablehead = document.getElementsByClassName(this.type+"-table-head")[0];
    var tablebody = document.getElementsByClassName(this.type+"-table-list")[0];
    var self = this;
    var headers = [];
    if(data.length>0){
	headers = Object.keys(data[0]);
    }else{
	console.warn("No data to be published for "+this.type);
	return;
    }
    var fil = this.activeClass;
    tablebody.innerHTML = data
	//.filter((row,index)=>{
	//    return row.tags.indexOf(fil)>=0;
//})
.map((row,index)=>{
	    return self.getRow(row.id,row);
	}).join("");
    tablehead.innerHTML = this.getHeaderRow(headers);
}
Page.prototype.update = function(service){
    var d = new service()._list(this.type);
    this.updateTable(d);
    this.updateStats(d);
}
Page.prototype.render = function(){
    var ht = document.createElement('div');
    ht.className = 'content '+this.type+'-table';
    ht.innerHTML =  this.getPipeline()+ this.getTable()+this.getWidget();
    document.getElementsByTagName("body")[0].appendChild(ht);
}

function renderList(className,rowData,tag){
    var tablehead = document.getElementsByClassName(className+"-head")[0];
    var tablebody = document.getElementsByClassName(className+"-list")[0];
    tablebody.innerHTML = rowData.data.map((row,index)=>{
	return getRow(index+1,row);
    }).join("") + "<tr><th scope='row' colspan='1'>"
    +"<a href='' class='btn btn-default btn-rounded mb-4' data-toggle='modal' data-target='#modalContactForm'>Add</a></th></tr>";
    tablehead.innerHTML = getHeaderRow(rowData.headers);
}



function filterList(all,filterString){
    return {
	headers: all.headers,
	data : all.data.filter((entry)=>{
	    return entry.tags.indexOf(filterString)>=0;
	})
    };
}
