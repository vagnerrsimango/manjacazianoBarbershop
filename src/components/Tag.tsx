import MyButton from './MyButton';
interface ITag {
  title: string;
}
export default function Tag({ title }: ITag) {
  return (
    <MyButton
      title={title}
      bg="primary.600"
      mr={2}
      rounded={'4'}
      weight="700"
      height={8}
      type="PRIMARY"
      p={6}
    />
  );
}
