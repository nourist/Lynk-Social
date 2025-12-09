import SettingsForm from './_components/settings-form';
import { getCurrentUser } from '~/services/auth';

const SettingsPage = async () => {
	const user = await getCurrentUser();

	return (
		<div className="w-full px-6">
			<div className="mx-auto flex max-w-7xl py-6">
				<SettingsForm user={user} />
			</div>
		</div>
	);
};

export default SettingsPage;
