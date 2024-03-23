import { GatsbyFunctionRequest, GatsbyFunctionResponse } from "gatsby";

export default async function getMailtoLinkHandler(
    req: GatsbyFunctionRequest,
    res: GatsbyFunctionResponse,
) {
    return res.status(200).json({ email: process.env.USER_EMAIL });
}
