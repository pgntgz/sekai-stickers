import { useRef, useEffect } from 'react'
import "../index.css"

const Canvas = props => {
  const { draw, redrawTrigger, ...rest } = props;
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    draw(context);
  }, [draw, redrawTrigger]);
  
  return <canvas ref={canvasRef} {...rest} />;
};

export default Canvas