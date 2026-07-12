import SingleDay from "@/components/singleDay";
export function generateStaticParams() {
  return Array.from({length:7},(_,index)=>({day:`day-${index+1}`}));
}
export default function DayPage() {
  return <SingleDay />;
}
