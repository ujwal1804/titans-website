import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { savePayment } from "@/lib/mongodb-service";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const file = formData.get("paymentScreenshot");

    // Validate
    if (!name || !email || !phone || !file) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Step 1: Upload to Cloudinary FIRST and WAIT for URL
    console.log("📤 Step 1: Uploading to Cloudinary...");
    let imageUrl = "";
    
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: "titans-trading-payment-screenshots",
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              console.error("❌ Cloudinary error:", error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        ).end(buffer);
      });

      // Verify we got a valid URL
      if (!result || !result.secure_url) {
        throw new Error("Cloudinary upload succeeded but no URL returned");
      }

      imageUrl = result.secure_url;
      console.log("✅ Step 1 Complete: Uploaded to Cloudinary");
      console.log("   URL:", imageUrl);
      console.log("   URL length:", imageUrl.length);
      
    } catch (error) {
      console.error("❌ Step 1 Failed: Cloudinary upload error:", error);
      return NextResponse.json(
        { success: false, message: "Failed to upload image to Cloudinary" },
        { status: 500 }
      );
    }

    // Step 2: ONLY save to Google Sheets AFTER we have a valid URL
    if (!imageUrl || imageUrl.length === 0) {
      console.error("❌ No image URL available - cannot save to Google Sheets");
      return NextResponse.json(
        { success: false, message: "Image upload failed - no URL received" },
        { status: 500 }
      );
    }

    console.log("📤 Step 2: Saving to Google Sheets with URL...");
    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;
    
    if (!GOOGLE_SCRIPT_URL) {
      console.warn("⚠️ GOOGLE_SCRIPT_URL not set - skipping Google Sheets save");
      return NextResponse.json({
        success: true,
        message: "Form submitted successfully (Cloudinary only)",
        imageUrl,
      });
    }

    try {
      const dataToSend = {
        action: "addLead",
        data: {
          name,
          email,
          phone,
          screenshotUrl: imageUrl, // This is guaranteed to have a value now
          timestamp: new Date().toISOString(),
        },
      };
      
      console.log("📤 Sending to Google Sheets:");
      console.log("   Name:", name);
      console.log("   Email:", email);
      console.log("   Phone:", phone);
      console.log("   Screenshot URL:", imageUrl);
      console.log("   Full payload:", JSON.stringify(dataToSend, null, 2));
      
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
      
      if (!response.ok) {
        throw new Error(`Google Sheets API returned ${response.status}`);
      }
      
      const result = await response.json();
      console.log("✅ Step 2 Complete: Google Sheets response:", result);
      
      // Save to MongoDB (regardless of Google Sheets success)
      try {
        await savePayment({
          name,
          email,
          phone,
          screenshotUrl: imageUrl,
          timestamp: new Date().toISOString(),
        });
        console.log('✅ Saved payment data to MongoDB');
      } catch (dbError) {
        console.error('Error saving payment to MongoDB:', dbError);
      }
      
      if (!result.success) {
        console.error("⚠️ Google Sheets returned error:", result.message);
        // Still return success since Cloudinary upload worked
        return NextResponse.json({
          success: true,
          message: "Image uploaded but Google Sheets save failed",
          imageUrl,
          warning: result.message,
        });
      }
      
    } catch (error) {
      console.error("❌ Step 2 Failed: Google Sheets save error:", error);
      
      // Still save to MongoDB even if Google Sheets fails
      try {
        await savePayment({
          name,
          email,
          phone,
          screenshotUrl: imageUrl,
          timestamp: new Date().toISOString(),
        });
        console.log('✅ Saved payment data to MongoDB (after Google Sheets error)');
      } catch (dbError) {
        console.error('Error saving payment to MongoDB:', dbError);
      }
      
      // Still return success since Cloudinary upload worked
      return NextResponse.json({
        success: true,
        message: "Image uploaded but Google Sheets save failed",
        imageUrl,
        warning: error.message,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Form submitted successfully",
      imageUrl,
    });
  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
