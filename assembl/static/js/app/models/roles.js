'use strict';

define(['models/base', 'common/context'], function (Base, Ctx) {

    var roleModel = Base.Model.extend({
        urlRoot: Ctx.getApiV2DiscussionUrl("/all_users/" + Ctx.getCurrentUserId() + "/local_roles"),
        idAttribute: "id",
        defaults: {
            'requested': false,
            'discussion': null,
            'role': null,
            'user': null,
            '@id': null,
            '@type': null,
            '@view': null
        },

        isUserSubscribed: function () {
            return (this.get('discussion') === null) ? false : true;
        }

    });

    var roleCollection = Base.Collection.extend({
        url: Ctx.getApiV2DiscussionUrl("/all_users/" + Ctx.getCurrentUserId() + "/local_roles"),
        model: roleModel
    });

    return {
        Model: roleModel,
        Collection: roleCollection
    };
});