import axios from 'axios';

export default class BookMark{

    constructor(url){
        this.url = url;
    }

    async ajax(link , method , body){
        try{
            const ajaxRes = axios({
                method:method,
                url:link,
                data:body,
                headers:{
                    'Accept':'application/json' , 
                    "Content-Type":"application/json; charset=ISO-8859-1",
                },
            })
            return ajaxRes;
        }catch(e){

            return e;

        }
       
    }


    async getAllBookmark(method , body){

        this.Bookmarks = await this.ajax(this.url , method , body);
    }
    async addBookmark(method , body){

        this.AddedBookmark = await this.ajax(this.url , method ,  body)
    }

    async deleteBookmark(method , body){

        this.DeleteBookmark =  await this.ajax(this.url , method , body);
    }

}