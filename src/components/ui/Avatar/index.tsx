import { FC, useState } from 'react';
import { User } from 'lucide-react';
import './style.css';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  shape?: 'circle' | 'square';
  className?: string;
  username?: string;
}

const Avatar: FC<AvatarProps> = ({
  src,
  alt = 'User avatar',
  size = 'md',
  shape = 'circle',
  className = '',
  username
}) => {
  const [imageError, setImageError] = useState(false);
  
  const renderFallback = () => {
    if (username) {
      return (
        <span className="fallback-text">
          {username[0].toUpperCase()}
        </span>
      );
    }
    return <User className="fallback-icon" />;
  };

  return (
    <div
      className={`avatar-base avatar-${size} avatar-${shape} ${className}`}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt}
          className="avatar-image"
          onError={() => setImageError(true)}
        />
      ) : (
        renderFallback()
      )}
    </div>
  );
};

export default Avatar;