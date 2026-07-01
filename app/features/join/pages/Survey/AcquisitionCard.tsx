import ToggleCardWrapper from "@join/components/ui/custom/toggle-card-wrapper";

type ToggleCardWrapperProps = React.ComponentProps<typeof ToggleCardWrapper>;

interface AcquisitionCardProps
  extends Omit<ToggleCardWrapperProps, "children"> {
  label: string;
  icon: string;
}

export const AcquisitionCard = ({
  label,
  icon,
  isSelected,
  className,
  ...props
}: AcquisitionCardProps) => {
  return (
    <ToggleCardWrapper isSelected={isSelected} className={className} {...props}>
      <img src={icon} alt={label} className="mb-2 h-10 w-10" />
      <span className="font-semibold text-sm">{label}</span>
    </ToggleCardWrapper>
  );
};
