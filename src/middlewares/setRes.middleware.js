export const setResContentTypeToTextHtml = (req, res, next) => {
    res.set("Content-Type", "text/html");
    next();
  };
  
  export const setResContentTypeToApplicationJson = (req, res, next) => {
    res.set("Content-Type", "application/json");
    next();
  };