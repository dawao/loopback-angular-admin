'use strict';

module.exports = function (Note) {

	Note.observe('before save', function updateTimestamp(ctx, next) {
	  if (ctx.instance) {
	    ctx.instance.created = Date.now();
	  } else {
	    ctx.data.created = Date.now();
	  }
	  next();
	});
	
	Note.beforeRemote('create', function(context, user, next) {
	    var req = context.req;
	    //req.body.created = Date.now();
	    //console.log(req.body.created);
	    req.body.ownerId = req.accessToken.userId;
	    next();
	});/* remote hook isn't working when call upsert.*/
	
  Note.createFakeData = function (faker) {
    return Note.create({
      title: faker.lorem.sentence(),
      body: faker.lorem.paragraph()
    });
  }

};
