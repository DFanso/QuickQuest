import axios from 'axios';

const uploadImage = async (file: File): Promise<string> => {
  try {
    // Replace spaces in the file name with underscores
    const sanitizedFileName = file.name.replace(/\s+/g, '_');

    // Generate pre-signed URL
    const presignedUrlResponse = await axios.post<{ presignedUrl: string; s3url: string }>(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/s3/generate-presigned-url`,
      {
        fileName: sanitizedFileName,
        domain: 'DP',
        contentType: file.type,
      }
    );

    const { presignedUrl, s3url } = presignedUrlResponse.data;

    // Check if the URL is valid
    if (presignedUrl && presignedUrl.startsWith('http')) {
      // Upload image to S3 using the pre-signed URL
      await axios.put(presignedUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
      });

      return s3url;
    } else {
      throw new Error('Invalid pre-signed URL');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export default uploadImage;
