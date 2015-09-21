module.exports = function(Strategy) {
	
	Strategy.observe('before save', function updateTimestamp(ctx, next) {
	  if (ctx.instance) {
	    ctx.instance.created = Date.now();
	  } else {
	    ctx.data.created = Date.now();
	  }
	  next();
	});
	
	Strategy.beforeRemote('create', function(context, user, next) {
	    var req = context.req;
	    //req.body.created = Date.now();
	    //console.log(req.body.created);
	    req.body.ownerId = req.accessToken.userId;
	    next();
	});/* remote hook isn't working when call upsert.*/
};
