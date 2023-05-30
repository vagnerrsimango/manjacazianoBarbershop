import { Button as NButton, Text, IButtonProps } from 'native-base';
interface ButtonProps extends IButtonProps {
  title: string;
  type?: 'PRIMARY' | 'SECONDARY';
  weight?: string;
  height?: number;
  fontSize?: string | number;
  textPadding?: string | number;
  bg?: string;
}

export default function MyButton({
  title,
  bg,
  weight = 'normal',
  type = 'PRIMARY',
  height = 12,
  fontSize = 'xs',
  textPadding,
  ...rest
}: ButtonProps) {
  return (
    <NButton
      mt={2}
      w={100}
      h={height}
      borderWidth={0}
      borderRadius={0}
      textTransform="uppercase"
      bg={bg || type == 'SECONDARY' ? 'primary.400' : 'primary.300'} // Use the passed bg prop or fallback to a default value
      {...rest}
      _pressed={{
        bg: type == 'SECONDARY' ? 'primary.300' : 'primary.400',
      }}
      _loading={{
        _spinner: { color: 'black' },
      }}
    >
      <Text
        p={textPadding}
        fontSize={fontSize}
        color={type == 'SECONDARY' ? 'white' : 'white'}
        fontFamily="heading"
        textTransform={'uppercase'}
        fontWeight={weight}
      >
        {title}
      </Text>
    </NButton>
  );
}
