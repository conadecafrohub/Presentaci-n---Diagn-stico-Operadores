import React, { Suspense, lazy, useState } from 'react';
import { Loader2 } from 'lucide-react';

const Spline = lazy(() => import('@splinetool/react-spline'));

export default function SplineScene({ scene, onLoad, className = "" }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative w-full h-full min-h-[300px] flex items-center justify-center overflow-hidden ${className}`}>
      
      {/* Loading Spinner */}
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 bg-brand-dark/20 z-10">
          <Loader2 size={36} className="text-brand-yellow animate-spin" />
          <span className="text-xs text-gray-400 font-sans tracking-wide">Cargando visualización 3D...</span>
        </div>
      )}

      {/* Dynamic 3D Scene */}
      <Suspense fallback={null}>
        <div 
          className="absolute top-0 -left-[15px] w-[calc(100%+60px)] h-[calc(100%+60px)] transition-opacity duration-700 ease-in-out"
          style={{ opacity: isLoaded ? 1 : 0 }}
        >
          <Spline 
            scene={scene} 
            onLoad={(splineApp) => {
              setIsLoaded(true);
              
              // Camera and Orbit Controls reset hack:
              // Simulates a tiny pointer drag (2px) to trigger Orbit Controls update on load.
              // This instantly centers the character in the view, resolving the cut-off perspective.
              setTimeout(() => {
                try {
                  const canvas = splineApp.canvas || document.querySelector('canvas');
                  if (canvas) {
                    const rect = canvas.getBoundingClientRect();
                    const x = rect.left + rect.width / 2;
                    const y = rect.top + rect.height / 2;
                    
                    canvas.dispatchEvent(new PointerEvent('pointerdown', { clientX: x, clientY: y, bubbles: true }));
                    canvas.dispatchEvent(new PointerEvent('pointermove', { clientX: x + 2, clientY: y + 2, bubbles: true }));
                    canvas.dispatchEvent(new PointerEvent('pointerup', { clientX: x + 2, clientY: y + 2, bubbles: true }));
                  }
                } catch (err) {
                  console.warn("Could not auto-adjust Spline camera:", err);
                }
              }, 400);

              if (onLoad) onLoad(splineApp);
            }}
          />
        </div>
      </Suspense>

    </div>
  );
}
