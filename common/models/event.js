'use strict';

module.exports = function (Event) {

	Event.observe('before save', function updateTimestamp(ctx, next) {
	  if (ctx.instance) {
	    ctx.instance.created = Date.now();
	  } else {
	    ctx.data.created = Date.now();
	  }
	  next();
	});

	Event.beforeRemote('create', function(context, user, next) {
	    var req = context.req;
	    //req.body.created = Date.now();
	    //console.log(req.body.created);
	    req.body.ownerId = req.accessToken.userId;
	    req.body.badgeClass = 'info';
	    next();
	});/* remote hook isn't working when call upsert.*/

};
