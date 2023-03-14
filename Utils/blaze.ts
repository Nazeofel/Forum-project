import { sha1 } from "crypto-hash";

export async function getFileInfo(
  apiURL: string,
  authToken: string,
  fileId: string
) {
  let json = null;
  try {
    const req = await fetch(apiURL, {
      method: "GET",
      headers: {
        Authorization: authToken,
      },
      body: JSON.stringify({
        fileId: fileId,
      }),
    });
    if (!req) {
      throw new Error(
        "an error occured while getting the informations on the file."
      );
    }
    const res = req.json();
    json = res;
  } catch (e) {
    if (e instanceof Error) {
      return console.log(e.message);
    }
  }
  return json;
}

async function authorization() {
  let json = null;

  try {
    const apKID = "7f6f6b1e7086";
    const apK = "0036ce8a2755bfa826ba2d9a49a926bdc281a06124";
    const authToken = Buffer.from(`${apKID}:${apK}`).toString("base64");
    const req = await fetch(
      "https://api.backblazeb2.com/b2api/v2/b2_authorize_account",
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${authToken}`,
        },
      }
    );
    if (!req.ok) {
      throw new Error("An error occured while getting the authorization");
    }
    const res = await req.json();
    json = res;
  } catch (e) {
    if (e instanceof Error) {
      console.log("Authorization Error", e.message);
    }
  }

  return json;
}

async function getUploadUrl(apiURL: string, authToken: string) {
  let json = null;
  try {
    const req = await fetch(`${apiURL}/b2api/v2/b2_get_upload_url`, {
      method: "POST",
      headers: {
        Authorization: authToken,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        bucketId: "774fc6ff062bd16e87600816",
      }),
    });
    if (!req.ok) {
      throw new Error("An error occured while getting the upload url");
    }
    const res = await req.json();
    json = res;
  } catch (e) {
    if (e instanceof Error) {
      console.log("Upload Url Error", e.message);
    }
  }

  return json;
}

async function handleUpload(imageData: File) {
  let buffer = null;
  const promise = new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(imageData);
    if (fileReader === null) {
      return;
    }
    fileReader.onload = (e) => {
      if (e.target === null) return;
      if (e.target.DONE === fileReader.DONE) {
        const fileBuffer = fileReader.result;
        if (!fileBuffer) {
          reject("error happened");
        }
        resolve(fileBuffer);
      }
    };
  });
  buffer = promise;
  return buffer;
}

export async function uploadFile(
  uploadURL: string,
  authToken: string,
  imageData: File,
  name: string
) {
  let json = null;
  try {
    const fileBuffer = (await handleUpload(imageData)) as ArrayBuffer;
    if (!fileBuffer) {
      throw new Error("An error happend while fetching the file buffer");
    }
    const sha1Img = await sha1(fileBuffer);
    const req = await fetch(uploadURL, {
      method: "POST",
      headers: {
        Authorization: authToken,
        "Content-type": imageData.type,
        "X-Bz-File-Name": Buffer.from(`${name}-${imageData.name}`).toString(
          "utf-8"
        ),
        "Content-Length": `${fileBuffer}`,
        "X-Bz-Content-Sha1": sha1Img,
      },
      body: fileBuffer,
    });

    if (!req.ok) {
      throw new Error("couldn't upload the image");
    }
    const res = req.json();
    json = res;
  } catch (e) {
    if (e instanceof Error) {
      console.log("Upload Image Error", e.message);
    }
  }
  return json;
}

export async function addImageToBucket() {
  let json = null;
  try {
    const auth = await authorization();
    if (!auth) {
      throw new Error("Error while trying to get the auth token");
    }
    const uploadURL = await getUploadUrl(auth.apiUrl, auth.authorizationToken);
    if (!uploadURL) {
      throw new Error("Error while trying to get the upload URL");
    }
    const res = await uploadURL;
    json = res;
  } catch (e) {
    if (e instanceof Error) {
      console.log("Request to add Image to bucket !", e.message);
    }
  }

  return json;
}
