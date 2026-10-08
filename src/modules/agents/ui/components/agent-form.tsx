import { useRouter } from "next/navigation";
import { AgentGetOne } from "../../types";
import { trpc } from "@/trpc/client";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { agentsInsertSchema } from "../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import { Form,FormControl,FormField,FormItem,FormLabel,FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";


interface AgentFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    initialValues?: AgentGetOne;
}

export const AgentForm = ({
    onSuccess,
    onCancel,
    initialValues,
}: AgentFormProps) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof agentsInsertSchema>>({
        resolver: zodResolver(agentsInsertSchema),
        defaultValues: {
            name: initialValues?.name ?? "",
            instructions: initialValues?.instructions ?? "",
            model: (initialValues as any)?.model ?? "auto",
        },
    });

    // The key change is here
    // use tRPC mutation hook
    const createAgent = trpc.agents.create.useMutation({
        onSuccess: async () => {
                await queryClient.invalidateQueries({
                        queryKey: [["agents", "getMany"]]
                    });

                if (initialValues?.id){
                    await queryClient.invalidateQueries({
                        queryKey : [["agents","getOne"],{input : {id : initialValues.id}}] // i need to input the initialvalues.id here
                    })
              }
            onSuccess?.();              
        },

        onError: (error) => {
        toast.error(error.message);
        // check if error code is working or not, if not then redirect to update the session status
        },
    });
    
    const updateAgent = trpc.agents.update.useMutation({
        onSuccess: async () => {
                await queryClient.invalidateQueries({
                        queryKey: [["agents", "getMany"]]
                    });

                if (initialValues?.id){
                    await queryClient.invalidateQueries({
                        queryKey : [["agents","getOne"],{input : {id : initialValues.id}}] // i need to input the initialvalues.id here
                    })
              }
            onSuccess?.();              
        },

        onError: (error) => {
        toast.error(error.message);
        // check if error code is working or not, if not then redirect to update the session status
        },
    }); 

    const isEdit = !!initialValues?.id;
    const isPending = createAgent.isPending || updateAgent.isPending;

    useEffect(() => {
        if (initialValues) {
            form.reset({
                name: initialValues.name,
                instructions: initialValues.instructions,
                model: (initialValues as any).model ?? "auto",
            });
        }
    }, [initialValues, form]);

    const onSubmit = (values: z.infer<typeof agentsInsertSchema>) => {
        if (isEdit) {
            updateAgent.mutate({ ...values, id: initialValues.id})
        } else {
            createAgent.mutate(values);
        }
    };
    

    // Remember to return JSX for the component to render
    return (
        <Form {...form}>
            <form className="space-y-4" onSubmit ={form.handleSubmit(onSubmit)}>
                <GeneratedAvatar
                    seed={form.watch("name")}
                    variant = "botttsNeutral"
                    className="border size-16"
                />
                <FormField name = "name" control = {form.control} render = {({field}) => (
                    <FormItem>
                        <FormLabel>
                            Name
                        </FormLabel> 
                        <FormControl>
                            <Input {...field} placeholder="Lakshay-Agent"/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}>
                </FormField>
                <FormField name = "instructions" control = {form.control} render = {({field}) => (
                    <FormItem>
                        <FormLabel>
                            Instructions 
                        </FormLabel> 
                        <FormControl>
                            <Textarea {...field} placeholder="You are a technical interviewer. The user will provide topics, skills, or goals instead of a resume. Use these inputs to design and ask relevant technical and problem-solving interview questions. Tailor the difficulty to the user’s level, and give feedback on their answers."/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}>
                </FormField>
                <FormField name = "model" control = {form.control} render = {({field}) => (
                    <FormItem>
                        <FormLabel>
                            AI Model Engine
                        </FormLabel> 
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger className="w-full bg-background/50 border-amber-300/40 focus:border-orange-500">
                                    <SelectValue placeholder="Select an AI model routing engine" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent className="border-amber-200/50 bg-popover/95 backdrop-blur-md">
                                <SelectItem value="auto">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">Auto Routing</span>
                                        <span className="text-xs text-muted-foreground">(Free: Gemini 2.0 / Llama 3.3 via OpenRouter)</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="meta-llama/llama-3.3-70b-instruct:free">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">Llama 3.3 70B</span>
                                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">(Free & Fast)</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="google/gemini-2.0-flash-exp:free">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">Gemini 2.0 Flash</span>
                                        <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">(Free & 1M Context)</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="gpt-4o">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">OpenAI GPT-4o</span>
                                        <span className="text-xs text-muted-foreground">(Direct OpenAI Fallback)</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage/>
                    </FormItem>
                )}>
                </FormField>
                <div className="flex items-center gap-x-2 pt-2">
                    <Button disabled = {isPending} type = "submit" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium shadow-sm"> {isEdit ? "Update Agent": "Create Agent"}</Button>
                    
                    {onCancel && (
                        <Button variant="ghost" disabled={isPending} type="button" onClick={() => onCancel()}>Cancel</Button>
                    )}
                    
                </div>

            </form>

        </Form>
    );
};