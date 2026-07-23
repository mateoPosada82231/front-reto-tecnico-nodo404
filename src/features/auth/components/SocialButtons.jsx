import Button from '../../../shared/components/Button';

function SocialButtons() {
    return (
        <div className="mt-6 border-t pt-6">
            <p className="mb-4 text-center text-sm text-slate-600">
                O regístrate con
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                >
                    Google
                </Button>

                <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                >
                    Facebook
                </Button>
            </div>
        </div>
    );
}

export default SocialButtons;