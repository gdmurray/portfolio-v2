import {GatsbyFunctionRequest, GatsbyFunctionResponse} from "gatsby";

export default async function getMailtoLinkHandler(
    req: GatsbyFunctionRequest,
    res: GatsbyFunctionResponse,
) {
    console.log("Got hit to API");
    return res.status(200).json({email: process.env.USER_EMAIL})
}
