
import { useState } from 'react';

type ButtonStyleType = 'default' | 'rounded' | 'pill' | 'outline' | 'subtle';

export const useThemeSettings = (
  initialThemeColor: string = '#9b87f5',
  initialButtonStyle: ButtonStyleType = 'default'
) => {
  const [themeColor, setThemeColor] = useState(initialThemeColor);
  const [buttonStyle, setButtonStyle] = useState<ButtonStyleType>(initialButtonStyle);

  return {
    themeColor,
    buttonStyle,
    setThemeColor,
    setButtonStyle
  };
};
