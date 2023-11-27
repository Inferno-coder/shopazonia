class APIFeatures{
    constructor(query,queryStr){
     this.query=query;
     this.queryStr=queryStr
    }
    search(){
        const keyword=this.queryStr.keyword?{
        name:{
            $regex:this.queryStr.keyword,
            $options:'i'
        }
        }:{}
        this.query.find({...keyword})
        return this
    }
    filter(){
        const  copy={...this.queryStr}
        //console.log(copy);
        const  fields=['keyword','limit','page']
        fields.forEach(element => {
            delete copy[element]
        });
        let temp=JSON.stringify(copy)
        temp=temp.replace(/\b(gt|gte|lt|lte)/g,match=>`$${match}`)
        this.query.find(JSON.parse(temp))
        return this
    }
    paginate(resPerPage){
        const curPage=Number(this.queryStr.page)|| 1
        const skip=resPerPage*(curPage-1)
        this.query.limit(resPerPage).skip(skip)
        return this
    }
}

module.exports=APIFeatures