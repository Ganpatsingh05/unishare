import ContactsLanding from "@features/contacts/components/ContactsLanding";
import { CONTACT_STRINGS } from "@features/contacts/constants/contactStrings";
import SmallFooter from "@components/layout/SmallFooter";

export const metadata = {
  title: CONTACT_STRINGS.meta.title,
  description: CONTACT_STRINGS.meta.description,
};

export default function ContactsPage() {
  return (
    <div className="flex flex-col">
      <ContactsLanding />
      <SmallFooter />
    </div>
  );
}
