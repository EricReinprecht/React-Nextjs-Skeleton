import '@styles/components/back_button.scss';
import Link from 'next/link';
import type { ReactNode } from 'react';

interface EditButtonProps {
    href: string;
    text?: ReactNode;
    className?: string;
    prefetch?: boolean;
}

export default function EditButton({
    href,
    text = 'Zurück',
    className = '',
    prefetch = false,
}: EditButtonProps) {
    return (
        <Link href={href} className={`back-button  ${className}`.trim()} prefetch={prefetch}>
            {text}
        </Link>
    );
}
