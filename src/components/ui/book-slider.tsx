import React, { forwardRef, useEffect, useRef } from 'react';
// @ts-ignore - react-pageflip default export handling in bundlers
import PageFlipModule from "react-pageflip";

// Cast to any to handle React 18 / bundler ESM compatibility
const HTMLFlipBook: any = (PageFlipModule as any).default || PageFlipModule;

export interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  pageNumber?: number;
}

// React-pageflip requires forwardRef on custom page components
export const FlipPage = forwardRef<HTMLDivElement, PageProps>(({ children, className = '', ...rest }, ref) => {
  return (
    <div
      ref={ref}
      className={`page bg-white text-slate-800 flex flex-col justify-between overflow-hidden shadow-md select-text ${className}`}
      style={{
        width: '100%',
        height: '100%',
        aspectRatio: '1 / 1.414', // Standard A4 portrait ratio
      }}
      {...rest}
    >
      {children}
    </div>
  );
});

FlipPage.displayName = 'FlipPage';

interface BookSliderProps {
  children: React.ReactNode;
  width?: number;
  height?: number;
  onFlip?: (e: { data: number }) => void;
  className?: string;
  bookRef?: React.RefObject<any>;
  flipDirection?: 'bottom' | 'top' | 'left' | 'right';
  startClosed?: boolean;
}

export function BookSlider({
  children,
  width = 440,
  height = 622,
  onFlip,
  className = '',
  bookRef,
  flipDirection = 'bottom',
  startClosed = true,
}: BookSliderProps) {
  const internalRef = useRef<any>(null);
  const pageFlipRef = useRef<any>(null);
  const isOpenedRef = useRef(!startClosed);

  const mergedRef = bookRef || internalRef;

  useEffect(() => {
    if (mergedRef?.current) {
      const book = mergedRef.current.pageFlip ? mergedRef.current.pageFlip() : mergedRef.current;
      pageFlipRef.current = book;
    }
  }, [mergedRef]);

  const openBook = () => {
    if (pageFlipRef.current && !isOpenedRef.current) {
      pageFlipRef.current.flip(1);
      isOpenedRef.current = true;
    }
  };

  const closeBook = () => {
    if (pageFlipRef.current && isOpenedRef.current) {
      pageFlipRef.current.flip(0);
      isOpenedRef.current = false;
    }
  };

  const toggleBook = () => {
    if (isOpenedRef.current) {
      closeBook();
    } else {
      openBook();
    }
  };

  // Expose methods on ref
  if (bookRef && typeof bookRef === 'object') {
    (bookRef as any).current = {
      ...mergedRef.current,
      open: openBook,
      close: closeBook,
      toggle: toggleBook,
      isOpened: () => isOpenedRef.current,
    };
  }

  return (
    <div className={`flipbook-viewport w-full flex items-center justify-center py-2 ${className}`}>
      <HTMLFlipBook
        ref={mergedRef}
        width={width}
        height={height}
        minWidth={300}
        maxWidth={620}
        minHeight={424}
        maxHeight={876}
        maxShadowOpacity={0.6}
        drawShadow={true}
        showCover={true}
        usePortrait={false}
        startPage={startClosed ? 0 : 1}
        autoSize={true}
        flippingTime={900}
        clickToFlip={true}
        showPageCorners={true}
        useMouseEvents={true}
        swipeDistance={30}
        disableFlipByClick={false}
        onFlip={onFlip}
        className="azad-flipbook shadow-2xl rounded-sm"
        style={{ margin: "0 auto", display: "block" }}
        // Flip direction for page corners
        mobileScrollSupport={true}
      >
        {children}
      </HTMLFlipBook>
    </div>
  );
}

export default BookSlider;
