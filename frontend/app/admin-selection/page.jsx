import { AdminSelectionCard } from "../components/admin/AdminSelectionCard";
import { FaBuildingUser } from "react-icons/fa6";
import { FaAddressBook } from "react-icons/fa6";
import { FaRegPenToSquare } from "react-icons/fa6";
import { FaVial } from "react-icons/fa6";
import FadeIn from "../components/basic/FadeIn";
import { FaToolbox } from "react-icons/fa";

// Admin tools page and the individual card components

function AdminSelection() {

  return (
    <FadeIn>

      <div className="flex flex-col gap-4">
        <div className="my-[5rem] flex flex-wrap sm:w-[30rem] md:w-[42rem] lg:w-[64rem] gap-[1rem] m-auto justify-around md:justify-between">
          <AdminSelectionCard
            title="Companies"
            icon={<FaBuildingUser size={100} />}
            link="./manage-companies/"
          />

          <AdminSelectionCard
            title="Analytes"
            link="./manage-analytes/"
            icon={<FaVial size={100} />}
          />

          <AdminSelectionCard
            title="Orders"
            link="./manage-orders/"
            icon={<FaRegPenToSquare size={100} />}
          />

          <AdminSelectionCard
            title="Equipment"
            link="./manage-equipment/"
            icon={<FaToolbox size={100} />}
          />

          <AdminSelectionCard
            title="Transactions"
            link="./manage-transactions/"
            icon={<FaAddressBook size={100} />}
          />

        </div>
      </div>
    </FadeIn>
  );

}

export default AdminSelection;
