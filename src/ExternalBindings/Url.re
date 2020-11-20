type urlObject;

[@bs.obj]
external urlObject:
  (
    ~auth: string=?,
    ~hash: string=?,
    ~host: string=?,
    ~hostname: string=?,
    ~href: string=?,
    ~pathname: string=?,
    ~protocol: string=?,
    ~search: string=?,
    ~slashes: bool=?,
    ~port: int=?,
    ~query: string=?,
    unit
  ) =>
  urlObject;

/**
 * Returns an array of prerelease components, or `null` if none exist.
 */
[@bs.module "url"]
external formatObject: urlObject => string = "format";
