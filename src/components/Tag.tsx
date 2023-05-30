import MyButton from './MyButton';
interface ITag {
  title: string;
}
export default function Tag({ title }: ITag) {
  return (
    <MyButton
      fontSize={10}
      title={title}
      bg="muted.400"
      mr={2}
      rounded={'4'}
      weight="700"
      height={8}
    />
  );
}
