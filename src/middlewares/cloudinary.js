const cloudinary = require("cloudinary").v2;
const createError = require("http-errors");

const config = cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 *
 * @param {"profile-pic" | "product-img"} uploadPreset
 */
const signUploadForm = (uploadPreset, publicId) => {
  const timestamp = Math.round(new Date().getTime() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
      public_id: publicId,
      upload_preset: uploadPreset,
    },
    config.api_secret,
  );

  return { timestamp, signature };
};

/**
 *
 * @param {"profile-pic" | "product-img"} imgType
 * @returns
 */
exports.getUploadAuthenticationInfo = (imgType) => {
  return (req, res, next) => {
    const { imgNames } = res.locals;
    if (!imgNames) {
      return next(createError(400));
    }

    const signatures = {};
    imgNames.forEach((name) => {
      const sig = signUploadForm(imgType, name);

      signatures[name] = {
        signature: sig.signature,
        timestamp: sig.timestamp,
      };
    });

    res.json({
      signatures: signatures,
      cloudName: config.cloud_name,
      apiKey: config.api_key,
    });
  };
};
