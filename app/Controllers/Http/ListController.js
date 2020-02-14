'use strict'

const List = use('App/Models/List')
const Database = use('Database')

class ListController {
    async index({auth}){
        const lists = await Database.from('lists').where('user_id',auth.user.id)

        return lists
    }

    async store({request, response, auth}){
        const data = request.only(['title', 'description'])

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
}

module.exports = ListController
