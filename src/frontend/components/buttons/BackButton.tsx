import '@styles/components/back_button.scss';
import Link from 'next/link';
import type { ReactNode } from 'react';

interface BackButtonProps {
    href: string;
    text?: ReactNode;
    className?: string;
    prefetch?: boolean;
}

export default function BackButton({
    href,
    text = 'Zurück',
    className = '',
    prefetch = false,
}: BackButtonProps) {
    return (
        <Link href={href} className={`back-button  ${className}`.trim()} prefetch={prefetch}>
            <span aria-hidden="true">←</span> {text}
        </Link>
    );
}
