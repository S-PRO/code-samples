export const CatchErrorMiddleware = async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    let payload = e;
    if (e.isBoom) {
      payload = e.output.payload;
      payload.data = e.data;
    } else {
      payload = e.message ? { error: e.message } : payload;
    }
    ctx.status = payload.statusCode || payload.status || 500;
    ctx.body = payload;
  }
};
