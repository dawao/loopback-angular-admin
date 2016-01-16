module.exports = function (user) {

  // Set the username to the users email address by default.
  user.observe('before save', function setDefaultUsername(ctx, next) {
    if (ctx.instance) {
      if(ctx.isNewInstance) {
        ctx.instance.username = ctx.instance.email;
      }
      ctx.instance.status = 'created';
      ctx.instance.created = Date.now();
    }
    next();
  });
  
  //reset the user's pasword
  user.beforeRemote('resetPassword', function (context, /*user,*/ next) {
      if (context.req.body.password) {
          if (!context.req.headers.access_token) return context.res.sendStatus(401);
        
          //verify passwords match
          if (!context.req.body.password ||
              !context.req.body.password_confirmation ||
              context.req.body.password !== context.req.body.password_confirmation) {


              var error = new Error();
              error.name = 'BAD_REQUEST'
              error.status = 400;
              error.message = 'Passwords do not match';
              error.code = 'PASSWORDS_DO_NOT_MATCH';
              return next(error)
          }

          user.findById(context.req.body.id, function (err, user) {
              if (err) return context.res.sendStatus(404);
              user.updateAttribute('password', context.req.body.password, function (err, user) {
                  if (err) return context.res.sendStatus(404);
                  console.log('> password reset processed successfully');
                  return context.res.sendStatus(202);
              });
          });

      }
      else {
          next();
      }

  });
};
