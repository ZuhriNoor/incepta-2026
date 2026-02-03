import { useEffect, useState, useMemo } from 'react';
import { X } from 'lucide-react';

const rawGalleryImages = [
    '/gallery/1.webp',
    '/gallery/2.webp',
    '/gallery/3.webp',
    '/gallery/4.webp',
    '/gallery/5.webp',
    '/gallery/6.webp',
    '/gallery/7.webp',
    '/gallery/8.webp',
    '/gallery/9.webp',
    '/gallery/10.webp',
    '/gallery/11.webp',
    '/gallery/12.webp',
    '/gallery/13.webp',
    '/gallery/14.webp',
    '/gallery/15.webp',
    '/gallery/16.webp',
    '/gallery/17.webp',
    '/gallery/18.webp',
    '/gallery/19.webp',
    '/gallery/20.webp',
    '/gallery/21.webp',
    '/gallery/22.webp',
    '/gallery/23.webp',
    '/gallery/24.webp',
    '/gallery/25.webp',
    '/gallery/26.webp',
    '/gallery/27.webp',
    '/gallery/28.webp',
    '/gallery/29.webp',
    '/gallery/30.webp',
    '/gallery/31.webp',
    '/gallery/32.webp',
    '/gallery/33.webp',
    '/gallery/34.webp',
    '/gallery/35.webp',
    '/gallery/36.webp',
    '/gallery/37.webp',
    '/gallery/38.webp',
    '/gallery/39.webp',
    '/gallery/40.webp',
    '/gallery/41.webp',
    '/gallery/42.webp',
    '/gallery/43.webp',
    '/gallery/44.webp',
    '/gallery/45.webp',
    '/gallery/46.webp',
    '/gallery/47.webp',
    '/gallery/48.webp',
    '/gallery/49.webp',
    '/gallery/50.webp',
    '/gallery/51.webp',
    '/gallery/52.webp',
    '/gallery/53.webp',
    '/gallery/54.webp',
    '/gallery/55.webp',
    '/gallery/56.webp',
    '/gallery/57.webp',
    '/gallery/58.webp',
    '/gallery/59.webp',
    '/gallery/60.webp',
    '/gallery/61.webp',
];

const galleryImages = rawGalleryImages.map(src => {
    const baseUrl = import.meta.env.BASE_URL;
    const cleanSrc = src.startsWith('/') ? src.slice(1) : src;
    return `${baseUrl}${cleanSrc}`;
});

const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

export default function Gallery() {
    const [selectedImage, setSelectedImage] = useState(null);

    const rows = useMemo(() => {
        return [
            [...shuffleArray(galleryImages), ...shuffleArray(galleryImages)], // Row 1
            [...shuffleArray(galleryImages), ...shuffleArray(galleryImages)], // Row 2
            [...shuffleArray(galleryImages), ...shuffleArray(galleryImages)]  // Row 3
        ];
    }, []);

    const handleImageClick = (img) => {
        setSelectedImage(img);
        document.body.style.overflow = 'hidden';
    };

    const closeOverlay = () => {
        setSelectedImage(null);
        document.body.style.overflow = 'auto';
    };

    return (
        <section id="gallery" className="gallery-section" aria-labelledby="gallery-title">
            <h2 className="section-title" id="gallery-title">Gallery</h2>
            <p className="section-subtitle">Glimpses of Department Events and ASCA Initiatives</p>

            <div className={`gallery-wrapper ${selectedImage ? 'paused' : ''}`}>
                <div className="gallery-container">
                    {rows.map((rowImages, rowIndex) => (
                        <div key={rowIndex} className={`gallery-row row-${rowIndex + 1}`} aria-label={`Gallery row ${rowIndex + 1}`}>
                            <div className="gallery-track">
                                {rowImages.map((src, index) => (
                                    <img
                                        key={`${rowIndex}-${index}`}
                                        src={src}
                                        className="gallery-img"
                                        loading="lazy"
                                        alt={`INCEPTA Gallery ${rowIndex + 1}-${index + 1}`}
                                        onClick={() => handleImageClick(src)}
                                    />
                                ))}
                                {/* Duplicate for seamless loop if needed, but CSS animation handles loop usually. 
                                    Depending on CSS implementation, we might need more duplication. 
                                    Let's stick to the double length we created in useMemo for now. 
                                */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Image Overlay/Modal */}
            {selectedImage && (
                <div className="gallery-modal" onClick={closeOverlay}>
                    <button className="gallery-modal-close" onClick={closeOverlay}>
                        <X size={32} />
                    </button>
                    <div className="gallery-modal-content" onClick={e => e.stopPropagation()}>
                        <img src={selectedImage} alt="Gallery Fullscreen" />
                    </div>
                </div>
            )}
        </section>
    );
}
