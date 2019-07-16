var hiringService = function(){
    this.rootURL = "";

	this._set = function(key,value){
	    localStorage.setItem(key,JSON.stringify(value));
	}

	this._get = function(key){
	    var l = localStorage.getItem(key);
	    if(l==null){ return [];}
	    return JSON.parse(l);
	}

	this._list = function(key){
	    return this._get(key);
	}

    this._getOne = function(key,id){
	return this._get(key).filter((or)=>{
	    return or.id.toString() === id.toString();
	}).pop();
    }

	this._add = function(key,item){
	    var o = this._get(key);
	    o.push(item);
	    this._set(key,o);
	}

	this._edit = function(key,item){
	    var found = false;
	    var o = this._get(key).map((or)=>{
		if(or.id.toString() === item.id.toString()){
		    found = true;
		    return item;
		}else{
		    return or;
		}
	    });
	    if(!found){ o.push(item);}
	    this._set(key,o);
	}

	this._delete = function(key,item){
	    var o = this._get(key).filter((or)=>{
		return item.id.toString() !== or.id.toString();
	    });
	    this._set(key,o);
	}

	this.getJDs = function(){
	    return this._list("jd");
	}

	this.addJD = function(jd){
	    return this._add("jd",jd);
	}

	this.editJD = function(jd){
	    return this._edit("jd",jd);
	}

	this.deleteJD = function(jd){
	    return this._delete("jd",jd);
	}

	this.getCandidates = function(){
	    return this._list("hiring");
	}
	this.addCandidate = function(candidate){
	    return this._add("hiring",candidate);
	}
	this.editCandidate = function(candidate){
	    return this._edit("hiring",candidate);
	}
	this.deleteCandidate = function(candidate){
	    return this._delete("hiring",candidate);
	}

	this.getUsers = function(){
	    return this._list("users");
	}

	this.addUser = function(user){
	    return this._add("users",user);
	}

	this.editUser = function(user){
	    return this._edit("users",user);
	}

	this.deleteUser = function(user){
	    return this._delete("users",user);
	}
}
