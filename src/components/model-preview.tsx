import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

interface Props {
  id: number;
  name: string;
  updatedAt: Date;
}

export default function ModelPreview({ id, name, updatedAt }: Props) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <Card className="w-full max-w-sm cursor-pointer transition-shadow hover:shadow-md">
      <Link href={`/models/${id}`}>
        <CardHeader>
          <CardTitle className="text-lg">{name}</CardTitle>
          <CardDescription>Updated {formatDate(updatedAt)}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted flex aspect-video items-center justify-center rounded-lg">
            <div className="text-muted-foreground text-sm">
              Preview coming soon
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
