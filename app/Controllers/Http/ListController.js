'use strict'

const List = use('App/Models/List')
const Database = use('Database')

class ListController {
    async index({auth}){
        const lists = await Database.from('lists')
        .where('user_id',auth.user.id)
        .where('done', false)

        return lists
    }

    async store({request, response, auth}){
        const data = request.only(['title', 'description', 'date'])

        const  list = await List.create({   user_id: auth.user.id,  ...data})

        return list;
    }

    async show({params}){

        const  list = await List.findOrFail(params.id)

        return list;
    }

    async destroy({auth, params}){
        const  list = await List.findOrFail(params.id)

        if(list.user_id !== auth.user.id){
            return Response.status(401);
        }

        await list.delete();
    }

    async getToday({auth}){
        var today = new Date;
        var start = new Date;
        start.setHours(0, 0, 0);
        today.setHours(23,59,59)

        // console.log(today, start)

        const lists = await Database.from('lists')
        .where('user_id',auth.user.id)
        .where('done', false)
        .whereBetween('date', [start, today])

        return lists
    }

    async getDone({auth}){

        // console.log(today, start)
        const lists = await Database.from('lists')
        .where('user_id',auth.user.id)
        .where('done', true)

        return lists
    }

    
    async update({auth, params, request}){
        const list = await List.findOrFail(params.id);
        const data = request.only(["done"]);
        
        list.merge(data);
        await list.save();
        
        return list
    }
}

module.exports = ListController
