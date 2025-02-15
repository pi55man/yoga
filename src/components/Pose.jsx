import React, { useRef, useEffect, useState } from "react";
import * as posenet from "@tensorflow-models/posenet";
import "@tensorflow/tfjs";

const Pose = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPoseNet = async () => {
      try {
        const net = await posenet.load();
        setLoading(false);
        await setupCamera();
        detectPose(net);
      } catch (error) {
        console.error("PoseNet loading failed:", error);
      }
    };

    const setupCamera = async () => {
      const video = videoRef.current;
      video.width = 640;
      video.height = 480;

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;

      return new Promise((resolve) => {
        video.onloadeddata = () => {
          video.play();
          resolve();
        };
      });
    };

    const detectPose = async (net) => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      setInterval(async () => {
        if (!video || video.readyState !== 4) return;

        // Estimate pose
        const pose = await net.estimateSinglePose(video, {
          flipHorizontal: false,
          decodingMethod: "single-person",
        });

        console.log("Detected Pose:", pose); // Debugging: Check detected keypoints

        drawPose(pose, ctx, video);
      }, 100);
    };

    const drawPose = (pose, ctx, video) => {
      if (!pose || !pose.keypoints) return;

      // Clear previous frame and draw video
      ctx.clearRect(0, 0, video.width, video.height);
      ctx.drawImage(video, 0, 0, video.width, video.height);

      // Draw keypoints (Only drawing high-confidence keypoints)
      ctx.fillStyle = "blue";
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;

      pose.keypoints.forEach((point) => {
        if (point.score > 0.5) {
          console.log(`Keypoint: ${point.part}, X: ${point.position.x}, Y: ${point.position.y}`);

          // Draw point
          ctx.beginPath();
          ctx.arc(point.position.x, point.position.y, 5, 0, 2 * Math.PI);
          ctx.fill();
        }
      });
    };

    loadPoseNet();
  }, []);

  return (
    <div className="">
      <h2>Yoga Pose Detector</h2>
      <h2>
  
      </h2>
      {loading && <p>Loading AI Model...</p>}
      <video ref={videoRef} width="640" height="480" autoPlay muted style={{ display: "none" }} />
      <canvas ref={canvasRef} width="640" height="480" style={{ border: "1px solid black" }} />
    </div>
  );
};

export default Pose;