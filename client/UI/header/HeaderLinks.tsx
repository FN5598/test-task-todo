import Link from "next/link";

type HeaderLinksProps = {
  name?: string;
  href: string;
};

export default function HeaderLinks({ name, href }: HeaderLinksProps) {
  return (
    <>
      <Link className="text-base font-black tracking-[-0.08em]" href={href}>
        {name}
      </Link>
    </>
  );
}
