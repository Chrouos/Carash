import { redirect } from 'next/navigation'

export default function Page() {
    const accessDenied = true
    if (accessDenied) {
        redirect('/login')
    }
}
