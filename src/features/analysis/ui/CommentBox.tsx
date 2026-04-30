import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type CommentBoxProps = {
  value: string;
  onChange: (value: string) => void;
};

export function CommentBox({ value, onChange }: CommentBoxProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="analyst-comment">Commentaire analyste</Label>
      <Textarea
        id="analyst-comment"
        placeholder="Ajoutez vos observations cliniques..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-[120px] border-slate-700 text-slate-100 placeholder:text-slate-500"
      />
    </div>
  );
}
