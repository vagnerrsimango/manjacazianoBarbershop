import { DotsNine, Scissors, TagSimple } from 'phosphor-react-native';
import MyButton from './MyButton';
import { useTheme } from 'native-base';
interface ITag {
  title: string;
}
export default function Tag({ title }: ITag) {
  const { colors } = useTheme();
  return (
    <MyButton
      title={title}
      bg="muted.400"
      mr={2}
      rounded={'4'}
      weight="700"
      height={10}
      leftIcon={<Scissors color={colors.white} size={16} />}
    />
  );
}
