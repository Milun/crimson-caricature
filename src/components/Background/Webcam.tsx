import { useEffect, useRef } from "react";

export function Webcam({
    width = 1280,
    height = 720,
}: {
    width?: number,
    height?: number
}) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        let stream: MediaStream | null = null;
        let cancelled = false;

        navigator.mediaDevices
            .getUserMedia({ video: { width: width, height: height }, audio: false })
            .then((s) => {
                if (cancelled) { s.getTracks().forEach((t) => t.stop()); return; }
                stream = s;
                if (videoRef.current) videoRef.current.srcObject = s;
            })
            .catch((err) => console.error("Webcam unavailable:", err));

        return () => {
            cancelled = true;
            stream?.getTracks().forEach((t) => t.stop()); // turns the camera light off
        };
    }, []);

    return <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scaleX(-1)'
        }}
    />;
}